import { FunctionComponent, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorageState from 'use-local-storage-state'

import logo from '/logo.svg'
import { CartWidget } from '../CartWidget'
import { CartProps } from '../Products/Products.tsx'
import classes from './header.module.scss'

export const Header: FunctionComponent = () => {
  // Refs for DOM elements
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const cartWidgetRef = useRef<HTMLDivElement>(null)
  const productsCountRef = useRef<HTMLSpanElement>(null)

  const [cart] = useLocalStorageState<CartProps>('cart', {})
  const productsCount: number = Object.keys(cart || {}).length

  useEffect(() => {
    const handleScroll = () => {
      const DISTANCE_FROM_TOP = 140
      const scrollY = window.scrollY || document.documentElement.scrollTop

      if (!headerRef.current || !logoRef.current || !cartWidgetRef.current || !productsCountRef.current) {
        return
      }

      if (scrollY > DISTANCE_FROM_TOP) {
        headerRef.current.style.transition = 'height 200ms ease-in'
        headerRef.current.style.height = '80px'

        logoRef.current.style.transition = 'height 200ms ease-in'
        logoRef.current.style.height = '4rem'

        cartWidgetRef.current.style.transition = 'height 200ms ease-in'
        cartWidgetRef.current.style.height = '2rem'

        productsCountRef.current.style.transition = 'font-size 200ms ease-in'
        productsCountRef.current.style.fontSize = '1.5em'
      } else {
        headerRef.current.style.height = '150px'
        logoRef.current.style.height = '6rem'
        cartWidgetRef.current.style.height = '3rem'
        productsCountRef.current.style.fontSize = '2em'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header ref={headerRef} className={classes.header}>
      <div>
        <Link to="/">
          <img
            ref={logoRef}
            src={logo}
            className={classes.logo}
            alt="The UpShop Application"
          />
        </Link>
      </div>
      <div ref={cartWidgetRef}>
        <CartWidget
          productsCount={productsCount}
          productsCountRef={productsCountRef} // pass ref down
        />
      </div>
    </header>
  )
}
