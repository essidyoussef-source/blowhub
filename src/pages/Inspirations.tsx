import { useState } from 'react'
import { Bookmark, Library } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import InspirationGrid from '../components/InspirationGrid'
import LibraryPage from './LibraryPage'
import Segmented from '../components/Segmented'

export default function Inspirations() {
  const [view, setView] = useState<'veille' | 'biblio'>('veille')
  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Inspirations"
        subtitle="Ta veille créative et ta réserve de munitions, réunies."
        icon={<Bookmark size={20} />}
        actions={
          <Segmented value={view} onChange={setView} options={[
            { id: 'veille', label: 'Veille', icon: Bookmark },
            { id: 'biblio', label: 'Bibliothèque', icon: Library },
          ]} />
        }
      />
      {view === 'veille' ? <InspirationGrid /> : <LibraryPage embedded />}
    </div>
  )
}
