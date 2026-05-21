export const useTheme = () => {
  const isLightMode = useState<boolean>('isLightMode', () => false)

  const applyTheme = () => {
    if (import.meta.client) {
      document.body.classList.toggle('light-mode', isLightMode.value)
      localStorage.setItem('theme', isLightMode.value ? 'light' : 'dark')
    }
  }

  const toggleTheme = () => {
    isLightMode.value = !isLightMode.value
    applyTheme()
  }

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme')
      isLightMode.value = savedTheme === 'light'
      applyTheme()
    }
  }

  return {
    isLightMode,
    toggleTheme,
    initTheme
  }
}