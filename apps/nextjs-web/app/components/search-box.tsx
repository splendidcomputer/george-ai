'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const SearchBox = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParameters = useSearchParams()
  const query = searchParameters.get('query')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const updatedParameter = new URLSearchParams(searchParameters.toString())
    if (inputValue) {
      updatedParameter.set('query', inputValue)
    } else {
      updatedParameter.delete('query')
    }
    router.replace(pathname + '?' + updatedParameter.toString(), {
      scroll: false,
    })
  }

  return (
    <div className="relative">
      <input
        className="input input-bordered w-full"
        type="text"
        defaultValue={query ?? ''}
        placeholder="Stellen Sie Ihre Frage an das Intranet..."
        onChange={handleInputChange}
      />
      <svg
        className="fill-current absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8"
        viewBox="0 0 40 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M38.122 14.154L3.482 0.314014C3.07601 0.147477 2.62633 0.119946 2.20306 0.235712C1.77979 0.351478 1.40671 0.604037 1.142 0.954014C0.869903 1.30152 0.7204 1.72927 0.716782 2.17061C0.713165 2.61195 0.855636 3.04209 1.122 3.39401L10.102 15.394C10.2308 15.576 10.2982 15.7943 10.2946 16.0173C10.291 16.2402 10.2166 16.4562 10.082 16.634L1.022 28.6C0.759047 28.9524 0.616989 29.3803 0.616989 29.82C0.616989 30.2597 0.759047 30.6876 1.022 31.04C1.20829 31.2884 1.44986 31.49 1.72757 31.6289C2.00528 31.7677 2.31151 31.84 2.622 31.84C2.88193 31.8421 3.13988 31.7946 3.382 31.7L38.102 17.9C38.4774 17.7533 38.8 17.4973 39.0282 17.1651C39.2563 16.8329 39.3794 16.4398 39.3816 16.0368C39.3837 15.6338 39.2648 15.2394 39.0402 14.9048C38.8157 14.5702 38.4958 14.3107 38.122 14.16V14.154ZM2.742 2.17401L34.862 15.014H12.122C12.0308 14.7183 11.8887 14.4408 11.702 14.194L2.742 2.17401ZM2.622 29.814L11.682 17.854C11.8825 17.6057 12.0321 17.3202 12.122 17.014H34.882L2.622 29.814Z" />
      </svg>
    </div>
  )
}
