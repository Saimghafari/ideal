'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { normalizeSlug } from '@/lib/normalizeSlug'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'Products' },
  { href: '', label: 'Add Product' },
]

const AddProduct = () => {
  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const { data: getCategory } = useFetch('/api/category?deleteType=SD&&size=10000')

  // media modal states  
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data
      const options = data.map((cat) => ({ label: cat.name, value: cat._id }))
      setCategoryOption(options)
    }
  }, [getCategory])

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    mrpPkr: true,
    sellingPricePkr: true,
    discountPercentage: true,
    discountPercentagePkr: true,
    description: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      mrpPkr: 0,
      sellingPricePkr: 0,
      discountPercentage: 0,
      discountPercentagePkr: 0,
      description: "",
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', normalizeSlug(name))
    }
  }, [form.watch('name')])

  // discount percentage calculation (USD + PKR)
  useEffect(() => {
    const mrp = form.getValues('mrp') || 0
    const sellingPrice = form.getValues('sellingPrice') || 0

    if (mrp > 0 && sellingPrice > 0) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
      form.setValue('discountPercentage', Math.round(discountPercentage))
    }

  }, [form.watch('mrp'), form.watch('sellingPrice')])

  useEffect(() => {
    const mrpPkr = form.getValues('mrpPkr') || 0
    const sellingPricePkr = form.getValues('sellingPricePkr') || 0

    if (mrpPkr > 0 && sellingPricePkr > 0) {
      const discountPercentagePkr = ((mrpPkr - sellingPricePkr) / mrpPkr) * 100
      form.setValue('discountPercentagePkr', Math.round(discountPercentagePkr))
    } else {
      form.setValue('discountPercentagePkr', 0)
    }

  }, [form.watch('mrpPkr'), form.watch('sellingPricePkr')])

  const editor = (event, editor) => {
    const data = editor.getData()
    form.setValue('description', data)
  }

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (selectedMedia.length <= 0) {
        return showToast('error', 'Please select media.')
      }

      values.slug = normalizeSlug(values.slug || values.name)
      const mediaIds = selectedMedia.map(media => media._id)
      values.media = mediaIds

      const { data: response } = await axios.post('/api/product/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Add Product</h4>
        </CardHeader>
        <CardContent className="pb-5">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >

              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>

                <div className=''>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name<span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter product name"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              form.setValue('slug', normalizeSlug(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="product-slug"
                            {...field}
                            onChange={(e) => {
                              field.onChange(normalizeSlug(e.target.value))
                            }}
                            onBlur={(e) => {
                              field.onChange(normalizeSlug(e.target.value))
                              field.onBlur()
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP (Rs) <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter MRP in rupees" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (Rs) <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter selling price in rupees" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="mrpPkr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter MRP in PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="sellingPricePkr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter Selling Price in PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount % <span className='text-red-500'>*</span></FormLabel>
                        <FormControl>
                          <Input type="number" readOnly placeholder="Discount %" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=''>
                  <FormField
                    control={form.control}
                    name="discountPercentagePkr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount % (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" readOnly placeholder="Discount % PKR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-5 md:col-span-2'>
                  <FormLabel className="mb-2">Description <span className='text-red-500'>*</span></FormLabel>
                  <Editor onChange={editor} />
                  <FormMessage></FormMessage>
                </div>

              </div>

              <div className='md:col-span-2 border border-dashed rounded p-5 text-center'>
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0
                  && <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                    {selectedMedia.map(media => (
                      <div key={media._id} className='h-24 w-24 border'>
                        <Image
                          src={media.url}
                          height={100}
                          width={100}
                          alt=''
                          className='size-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                }

                <div onClick={() => setOpen(true)} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'>
                  <span className='font-semibold'>Select Media</span>
                </div>

              </div>

              <div className='mb-3 mt-5'>
                <ButtonLoading loading={loading} type="submit" text="Add Product" className="cursor-pointer" />
              </div>

            </form>
          </Form>

        </CardContent>
      </Card>

    </div>
  )
}

export default AddProduct