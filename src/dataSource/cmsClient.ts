export type Options = RequestInit & {
  searchParams?: Record<string, string>
}

export class APIError extends Error {
  constructor(public response: Response) {
    super(response.statusText)
  }
}

export async function cmsClient<T>(
  path: string | URL,
  options?: Options,
): Promise<T> {
  const url = new URL(path, process.env.MICROCMS_ENDPOINT)
  if (options?.searchParams) {
    url.search = new URLSearchParams(options.searchParams).toString()
    delete options.searchParams
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'X-MICROCMS-API-KEY': String(process.env.MICROCMS_API_KEY),
    },
  })
  if (!response.ok) throw new APIError(response)
  return (await response.json()) as Promise<T>
}
