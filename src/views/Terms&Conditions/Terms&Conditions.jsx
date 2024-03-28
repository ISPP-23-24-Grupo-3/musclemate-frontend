import { Button, Flex, Heading } from '@radix-ui/themes'
import React from 'react'
import { Link } from 'react-router-dom'

export default function TermsConditions() {
    return (
        <>
            <Flex align="center" justify="center" direction="row">
                <Heading
                    size="6"
                    className="text-radixgreen !mt-8 !mb-3 text-center md:text-left"
                >
                    Términos y Condiciones de uso de
                </Heading>
                <img src="/pwa-64x64.png" alt="Logo" className="ml-2 mr-1 mt-3" />
                <Heading size="6" className="!mt-8 !mb-3 text-center">
                    MuscleMate
                </Heading>
            </Flex>
        </>
    )
}