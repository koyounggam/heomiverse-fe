import { Fragment, useEffect, useState } from 'react'
import { Fact } from './types/Fact'

const DAILY_LIMIT = 10

function App() {
  const [facts, setFacts] = useState([] as Fact[])
  const [currentFact, setCurrentFact] = useState(null as Fact | null)
  const [dailyViews, setDailyViews] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [modal, setModal] = useState({ show: false, message: '', type: '' as 'success' | 'error' | 'info' })

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem(`views_${today}`)
    setDailyViews(stored ? parseInt(stored) : 0)

    fetch('/facts.json')
      .then(res => res.json())
      .then((data: Fact[]) => {
        setFacts(data)
        if (data.length > 0 && (!stored || parseInt(stored) < DAILY_LIMIT)) {
          const randomFact = data[Math.floor(Math.random() * data.length)]
          setCurrentFact(randomFact)
        }
      })
  }, [])

  const showModal = (message: string, type: 'success' | 'error' | 'info'): Promise<void> => {
    return new Promise((resolve) => {
      setModal({ show: true, message, type })
      const timer = setTimeout(() => {
        setModal({ show: false, message: '', type: 'info' })
        resolve()
      }, 1500)
      
      const handleClick = () => {
        clearTimeout(timer)
        setModal({ show: false, message: '', type: 'info' })
        resolve()
      }
      
      const modalElement = document.querySelector('.modal-overlay')
      if (modalElement) {
        modalElement.addEventListener('click', handleClick, { once: true })
      }
    })
  }

  const handleQuizAnswer = async (userAnswer: boolean) => {
    if (currentFact?.type !== 'quiz') return
    
    if (userAnswer === currentFact.answer) {
      await showModal('정답입니다! 🎉', 'success')
    } else {
      await showModal('틀렸습니다. 다시 한번 생각해보세요!', 'error')
    }
    showFact()
  }

  const showFact = async () => {
    if (facts.length === 0) return
    
    const today = new Date().toISOString().slice(0, 10)
    const currentViews = dailyViews + 1
    
    if (currentViews > DAILY_LIMIT) {
      await showModal('오늘은 더 이상 볼 수 없어요 😥 내일 다시 와주세요!', 'info')
      return
    }

    const availableFacts = facts.filter(f => f.id !== currentFact?.id)
    const next = availableFacts[Math.floor(Math.random() * availableFacts.length)]
    setCurrentFact(next)
    setShowAnswer(false)
    setDailyViews(currentViews)
    localStorage.setItem(`views_${today}`, currentViews.toString())
  }

  const onBackgroundClick = async () => {
    if (currentFact?.type === 'quiz') return
    await showFact()
  }

  const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1]
  console.log(jwt)
  const loggedIn = jwt !== undefined

  return (
    <main className="fixed inset-0 grid place-items-center bg-white select-none cursor-default">
      {loggedIn ? (
        <button onClick={(e) => { location.href = '/mypage.html' }}
            className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors z-10 flex items-center gap-2">
          <i className="fa fa-user"></i>
        </button>
      ) : (
        <button onClick={(e) => { location.href = '/login.html' }}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors z-10 flex items-center gap-2">
        <i className="fa fa-sign-in"></i> 로그인
      </button>
      )}

      <div className="w-[90%] max-w-2xl" onClick={onBackgroundClick}>
        {currentFact ? (
          <>
            <p className="text-xl leading-relaxed text-center break-keep select-none">
              {currentFact.fact.split('\n').map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < currentFact.fact.split('\n').length - 1 && <br />}
                </Fragment>
              ))}
            </p>
            {currentFact.type === 'quiz' && !showAnswer && (
              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleQuizAnswer(true); }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  O
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleQuizAnswer(false); }}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  X
                </button>
              </div>
            )}
            {currentFact.type !== 'quiz' && (
              <p className="text-sm text-gray-400 mt-6 text-center select-none">
                (화면을 터치하면 새로운 상식을 볼 수 있어요)
              </p>
            )}
          </>
        ) : dailyViews >= DAILY_LIMIT ? (
          <p className="text-gray-500 text-center select-none">
            오늘은 더 이상 볼 수 없어요 😥 내일 다시 와주세요!
          </p>
        ) : (
          <p className="text-gray-500 text-center select-none">
            불러오는 중...
          </p>
        )}
      </div>

      {modal.show && (
        <div className="fixed inset-0 grid place-items-center bg-black/50 z-50 modal-overlay">
          <div 
            className={`px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              modal.type === 'success' ? 'bg-green-500' :
              modal.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white font-medium`}
          >
            {modal.message}
          </div>
        </div>
      )}
    </main>
  )
}

export default App