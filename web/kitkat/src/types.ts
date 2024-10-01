export type AppProps<
  TParams extends Record<string, string | number> | unknown,
  TSearchParams extends Record<string, string | object>
> = {
  params: TParams;
  searchParams: TSearchParams;
};


export type PropsWithClassName = {
  className?: string;
}