// interface QuranVerseProps {
//   verse: {
//     text: string;
//     translation: string;
//     numberInSurah: number;
//   };
//   isPlaying: boolean;
//   isCurrentVerse: boolean;
// }

// export function QuranVerse({ verse, isPlaying, isCurrentVerse }: QuranVerseProps) {
//   return (
//     <div 
//       className={`
//         p-4 rounded-lg transition-all duration-300
//         ${isCurrentVerse ? 'bg-green-50 dark:bg-green-900/20 scale-[1.02]' : 'bg-transparent'}
//         ${isPlaying && isCurrentVerse ? 'border-l-4 border-green-500' : ''}
//       `}
//     >
//       <div className="text-right font-arabic text-2xl mb-2">
//         {verse.text}
//       </div>
//       <div className="text-gray-600 dark:text-gray-300">
//         {verse.translation}
//       </div>
//       <div className="text-sm text-gray-500 mt-1">
//         {verse.numberInSurah}
//       </div>
//     </div>
//   );
// // }