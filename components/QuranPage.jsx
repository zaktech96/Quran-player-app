import { useState } from 'react'

export default function QuranPage() {
  const [fontSize, setFontSize] = useState('medium')
  const [reciter, setReciter] = useState('default')
  
  return (
    <div className="quran-container">
      <div className="quran-controls">
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="small">Small Text</option>
          <option value="medium">Medium Text</option>
          <option value="large">Large Text</option>
        </select>

        <select
          value={reciter}
          onChange={(e) => setReciter(e.target.value)} 
        >
          <option value="default">Default Reciter</option>
          <option value="mishary">Mishary Rashid</option>
          <option value="sudais">Abdur-Rahman As-Sudais</option>
        </select>

        <div className="audio-player">
          {/* Audio player component */}
        </div>
      </div>

      <div className="quran-grid">
        {surahs.map(surah => (
          <div key={surah.id} className="surah-card">
            <div className="arabic-text">{surah.arabic}</div>
            <div className="translation-text">{surah.translation}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 