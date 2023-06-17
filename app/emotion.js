'use client'

import { CacheProvider } from '@emotion/react'
import { ColorScheme, ColorSchemeProvider, createEmotionCache, MantineProvider } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useServerInsertedHTML } from 'next/navigation'

// must be created outside of the component to persist across renders
const cache = createEmotionCache({ key: 'my' })
cache.compat = true

export default function RootStyleRegistry({ children }) {
    useServerInsertedHTML(() => (
        <style
            data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(' '),
            }}
        />
    ))

    return (
        <CacheProvider value={cache}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{ colorScheme: 'dark' }}
                emotionCache={cache}
            >
                {children}
            </MantineProvider>
        </CacheProvider>
    )
}