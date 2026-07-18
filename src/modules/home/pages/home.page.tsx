import { BestSellingProducts } from "../components/best-selling-products.component";

export const HomePage = () => {
  // TODO: allow user to pick date range; default to current month for now
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-600 tracking-tight">Inicio</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BestSellingProducts startDate={startOfMonth} endDate={endOfMonth} />
      </div>
    </div>
  );
};
