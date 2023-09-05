import { PublicationState } from '@/src/gql/graphql'
import { FeedbackSelection } from './feedback-selection/feedback-selection'

interface TitleProps {
  title: string
  publicationState: PublicationState
  language: string
}

export const InfoCardTitle = ({
  title,
  publicationState,
  language,
}: TitleProps) => {
  return (
    <div className="flex gap-2 justify-between">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <span className="uppercase text-xs font-bold">{language}</span>
          <span className="font-bold line-clamp-1 text-lg" title={title}>
            {title}
          </span>
        </div>
        <div className="border border-black text-xs rounded-md px-4 bg-slate-100">
          {publicationState}
        </div>
      </div>
      <FeedbackSelection />
    </div>
  )
}
