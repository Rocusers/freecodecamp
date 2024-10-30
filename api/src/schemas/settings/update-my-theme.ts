import { Type } from '@fastify/type-provider-typebox';

export const toggleTheme = {
  body: Type.Object({
    theme: Type.Union([Type.Literal('light'), Type.Literal('dark')])
  }),
  response: {
    200: Type.Object({
      message: Type.Literal('flash.updated-themes'),
      type: Type.Literal('success')
    }),
    400: Type.Object({
      message: Type.Literal('flash.wrong-updating'),
      type: Type.Literal('danger')
    }),
    500: Type.Object({
      message: Type.Literal('flash.wrong-updating'),
      type: Type.Literal('danger')
    })
  }
};
