type Props = {
  items: number;
};

export default function MintInfoSkeleton({ items }: Props) {
  return Array.from({ length: items }).map((_, index) => (
    <div
      key={index}
      className="flex items-center space-x-2 bg-dark-500 p-2 rounded-md cursor-pointer animate-pulse"
    >
      <div className="w-8 h-8 bg-dark-50 animate-pulse rounded-full" />
      <div className="flex-1 flex flex-col space-y-1">
        <div className="w-1/3 p-1.5 bg-dark-50 rounded" />
        <div className="w-1/4 p-1 bg-dark-50 rounded" />
      </div>
    </div>
  ));
}
