'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { normalizeSlug } from '@/lib/normalizeSlug'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Image from 'next/image'
import useFetch from '@/hooks/useFetch'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: '', label: 'Add Category' },
]

const AddCategory = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])
  const { data: categoryList } = useFetch('/api/category?deleteType=SD&&size=10000')
  const parentOptions = (categoryList?.success ? categoryList.data : []).filter((item) => !item.parent)

  const formSchema = zSchema.pick({
    name: true, slug: true, shortDescription: true, parent: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      parent: "",
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) {
      form.setValue('slug', normalizeSlug(name))
    }
  }, [form.watch('name')])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/category/create', {
        ...values,
        slug: normalizeSlug(values.slug || values.name),
        shortDescription: values.shortDescription || '',
        categoryMedia: selectedMedia[0]?._id || null,
      })
      if (!response.success) {
        throw new Error(response.message)
      }

      form.reset()
      setSelectedMedia([])
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
          <h4 className='text-xl font-semibold'>Add Category</h4>
        </CardHeader>
        <CardContent className="pb-5">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter category name"
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
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="category-slug"
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
              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description shown on the landing page"
                          rows={3}
                          maxLength={200}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {(field.value?.length || 0)}/200 — shown under the category on the home page
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5'>
                <FormField
                  control={form.control}
                  name="parent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent category</FormLabel>
                      <FormControl>
                        <select
                          className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                          value={field.value || ""}
                          onChange={field.onChange}
                        >
                          <option value="">None — main category</option>
                          {parentOptions.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                          ))}
                        </select>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Leave empty to show this on the shop category cards. Choose a parent to make a subcategory for the side filters.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5 border border-dashed rounded p-5 text-center'>
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={false}
                />

                {selectedMedia.length > 0 && (
                  <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                    {selectedMedia.map(media => (
                      <div key={media._id} className='h-28 w-28 border relative'>
                        <Image
                          src={media.url}
                          height={112}
                          width={112}
                          alt=''
                          className='size-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'
                >
                  <span className='font-semibold'>
                    {selectedMedia.length ? 'Change Image' : 'Select Category Image'}
                  </span>
                </div>
              </div>

              <div className='mb-3'>
                <ButtonLoading loading={loading} type="submit" text="Add Category" className="cursor-pointer" />
              </div>

            </form>
          </Form>

        </CardContent>
      </Card>

    </div>
  )
}

export default AddCategory
