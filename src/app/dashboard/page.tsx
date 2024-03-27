import { UrlForm } from "@/app/ui/UrlForm";
import mlProductApi from "../api/mlProductApi";
import { DataTable } from "./dataTable";
import { columns } from "./columns";
import styles from "./page.module.css";

export default async function Dashboard() {
  const products = await mlProductApi.list();
  console.log(products);

  return (
    <main className={styles.main}>
      <div className="flex flex-col items-center">
        <div className="container mx-auto flex">
          <UrlForm />
        </div>
        <div className="container mx-auto py-10 space-y-2">
          <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tus productos
          </h2>
          <DataTable columns={columns} data={products} />
        </div>
      </div>
    </main>
  );
}
