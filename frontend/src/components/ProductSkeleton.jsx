const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-border-light rounded-2xl p-4 flex flex-col gap-4 animate-pulse shadow-sm">
      <div className="aspect-[1/1] w-full rounded-xl bg-gray-150" />
      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-16 bg-gray-150 rounded" />
        <div className="h-4 w-4/5 bg-gray-150 rounded mt-1" />
        <div className="h-3 w-24 bg-gray-150 rounded" />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-light/60">
          <div className="h-4 w-12 bg-gray-150 rounded" />
          <div className="h-7 w-7 rounded-full bg-gray-150" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
export const DetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse py-6">
      <div className="aspect-[4/4.5] w-full rounded-3xl bg-gray-150" />
      <div className="flex flex-col gap-6">
        <div className="h-3 w-20 bg-gray-150 rounded" />
        <div className="h-8 w-4/5 bg-gray-150 rounded" />
        <div className="h-4 w-28 bg-gray-150 rounded" />
        <div className="h-6 w-24 bg-gray-150 rounded mt-2" />
        <div className="h-16 w-full bg-gray-150 rounded mt-4" />
        <div className="h-10 w-full bg-gray-150 rounded mt-6" />
      </div>
    </div>
  );
};
