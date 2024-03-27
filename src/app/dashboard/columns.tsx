"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { ScheduleState } from "@/enums/ScheduleState";
import { ChangeDirection } from "@/enums/ChangeDirection";

export type Product = {
  id: string;
  name: string;
  url: string;
  price: string;
  created: string;
  state: keyof typeof ScheduleState;
  percentChange: number;
  changeDirection: string;
  updated?: Date;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre"
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const state = row.getValue("state");
      switch (state) {
        case ScheduleState.Playing:
          return "Rastreando";
        case ScheduleState.Stopped:
          return "Pausado";

        default:
          return "Error";
      }
    }
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    }
  },
  {
    accessorKey: "percentChange",
    header: "Cambio de precio",
    cell: ({ row }) => {
      const product = row.original;
      const percentChange = row.getValue("percentChange") as number;
      const text = percentChange.toString() + "%";
      if (product.percentChange === 0) {
        return "-";
      }
      if (product.changeDirection === ChangeDirection.Increase) {
        return (
          <div className="flex items-center">
            {text}
            <TbArrowBigUpFilled />
          </div>
        );
      }
      if (product.changeDirection === ChangeDirection.Decrease) {
        return (
          <div className="flex items-center">
            {text}
            <TbArrowBigDownFilled />
          </div>
        );
      }
    }
  },
  {
    accessorKey: "updated",
    header: "Actualizado",
    cell: ({ row }) => {
      const date = row.getValue("updated") as Date;
      const formattedDate = formatDate(date);
      return formattedDate;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.url)}
            >
              Copiar Url del producto
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver producto</DropdownMenuItem>
            <DropdownMenuItem>Pausar rastreo de precio</DropdownMenuItem>
            <DropdownMenuItem>Reanudar rastreo de precio</DropdownMenuItem>
            <DropdownMenuItem>Eliminar producto</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
