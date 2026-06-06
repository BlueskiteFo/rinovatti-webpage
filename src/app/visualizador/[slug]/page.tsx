import { notFound } from 'next/navigation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { VisualizerWrapper } from '@/components/shared/VisualizerWrapper'
import { productRepository } from '@/core/infrastructure/dependencies'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function VisualizadorPage({ params }: Props) {
  const { slug } = await params
  const product = await productRepository.getBySlug(slug)

  if (!product) notFound()

  return (
    <>
      <Navbar />
      <VisualizerWrapper product={product} />
      <Footer />
    </>
  )
}
