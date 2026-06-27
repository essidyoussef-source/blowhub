import { Bookmark } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import InspirationGrid from '../components/InspirationGrid'

export default function Inspirations() {
  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Inspirations"
        subtitle="Ta veille créative — colle les liens qui t'inspirent, retrouve-les avec leur aperçu."
        icon={<Bookmark size={20} />}
      />
      <InspirationGrid />
    </div>
  )
}
