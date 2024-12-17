'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Mail } from "lucide-react";

const Home = () => {
  return (
    <>
    {/* Main content */}
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Discover Mystique Message!</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>A place where anonymity meets conversations—take turns and share your thoughts freely!</p>
      </section>

      {/* Caraousel for Messages */}
      <Carousel 
      plugins={[Autoplay({delay: 2000})]}
      className="w-full max-w-lg md:max-w-xl">
      <CarouselContent>
        {
          messages.map((messages, index) => (
            <CarouselItem key={index} className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle>{messages.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                  <Mail className="flex-shrink-0"/>
                  <div>
                    <p>{messages.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {messages.received}
                    </p>
                  </div>
                  <span className="text-lg font-semibold">{messages.content}</span>
                </CardContent>
              </Card>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel> 
    </main>

    {/* Footer */}
    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">© 2024 Mystique Message. All rights reserved.</footer>
    </>
  )
}

export default Home
