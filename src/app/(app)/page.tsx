'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Discover Shade Message!</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>A place where anonymity meets conversations—take turns and share your thoughts freely!</p>
      </section>
      <Carousel 
      plugins={[Autoplay({delay: 2000})]}
      className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((messages, index) => (
            <CarouselItem key={index} className="p-4">
            <div className="p-1">
              <Card>
                <CardHeader>
                  {messages.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{messages.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel> 
    </main>
    <footer className="text-center p-4 md:p-6">2024 Shade Message. All rights reserved.</footer>
    </>
  )
}

export default Home
