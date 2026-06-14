import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getUserContacts, getContactById, createContact, updateContact, deleteContact, searchContacts } from "./db";
import { fetchAddressByCep } from "./_core/viaCepApi";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contacts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserContacts(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const contact = await getContactById(input.id, ctx.user.id);
        if (!contact) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contato não encontrado",
          });
        }
        return contact;
      }),

    create: protectedProcedure
      .input(
        z.object({
          nome: z.string().min(1, "Nome é obrigatório"),
          telefone: z.string().optional(),
          email: z.string().email("Email inválido").optional(),
          rua: z.string().optional(),
          numero: z.string().optional(),
          complemento: z.string().optional(),
          bairro: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createContact({
          userId: ctx.user.id,
          ...input,
        });
        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().min(1, "Nome é obrigatório").optional(),
          telefone: z.string().optional(),
          email: z.string().email("Email inválido").optional(),
          rua: z.string().optional(),
          numero: z.string().optional(),
          complemento: z.string().optional(),
          bairro: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const contact = await getContactById(id, ctx.user.id);
        if (!contact) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contato não encontrado",
          });
        }
        await updateContact(id, ctx.user.id, data);
        return await getContactById(id, ctx.user.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const contact = await getContactById(input.id, ctx.user.id);
        if (!contact) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Contato não encontrado",
          });
        }
        await deleteContact(input.id, ctx.user.id);
        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        return await searchContacts(ctx.user.id, input.query);
      }),

    searchAddressByCep: protectedProcedure
      .input(z.object({ cep: z.string() }))
      .query(async ({ input }) => {
        try {
          const address = await fetchAddressByCep(input.cep);
          if (!address) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "CEP não encontrado",
            });
          }
          return address;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao buscar endereço pelo CEP",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
