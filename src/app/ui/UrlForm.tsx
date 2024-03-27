"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import animationData from "../../assets/loader.json";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const typeOneMLUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      return (
        url.startsWith("https://") && url.includes(".mercadolibre.com.ar/MLA-")
      );
    },
    {
      message: "Url de producto invalido"
    }
  );

const typeTwoMLUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      return (
        url.startsWith("https://www.mercadolibre.com.ar/") &&
        url.includes("/p/MLA")
      );
    },
    {
      message: "Url de producto invalido"
    }
  );

const validMlUrl = z.union([typeOneMLUrlSchema, typeTwoMLUrlSchema]);

const FormSchema = z.object({
  url: validMlUrl
});

export const UrlForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: ""
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/mlProduct?url=${encodeURIComponent(data.url)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        toast("Agregaste un producto", {
          description: `${data.name}`,
          action: {
            label: "Recargar",
            onClick: () => console.log("Refresh")
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
        if (error.message.includes("Status: 500")) {
          toast.error("Error Interno del Servidor", {
            description: "Un error ocurrió al procesar su petición.",
            action: {
              label: "Reintentar",
              onClick: () => onSubmit(data)
            }
          });
        } else {
          toast.error("Error", {
            description: "Ocurrio un error."
          });
        }
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input placeholder="Url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <Button type="submit" disabled={loading}>
            {!loading ? "Agregar producto" : "Cargando..."}
          </Button>
        </div>
      </form>
    </Form>
  );
};
