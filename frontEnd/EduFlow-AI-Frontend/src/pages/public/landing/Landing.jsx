import React from 'react'
import { Navbar } from '../../../components/landing/navbar/Navbar'
import { Hero } from '../../../components/landing/hero/Hero'
import { Features } from '../../../components/landing/features/Features'
import { HowItWorks } from '../../../components/landing/how-it-works/HowItWorks'
import { About } from '../../../components/landing/about/About'
import { CTA } from '../../../components/landing/cta/CTA'
import { Footer } from '../../../components/landing/footer/Footer'

export const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <About /> 
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </>
    )
}






