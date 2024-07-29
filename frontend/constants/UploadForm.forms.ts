import { z } from "zod"


export const uploadFormSchema = z.object({
    title: z.string().min(2, {
        message: "title must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    price: z.coerce.number().int().gt(0, {
        message: "Price must be greater than 0.",
    }),
}
)