'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import MediaModal from '@/components/Application/Admin/MediaModal'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { normalizeSlug } from '@/lib/normalizeSlug'
import { showToast } from '@/lib/showToast'
import { ADMIN_BRANCH_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_BRANCH_SHOW, label: 'Branches' },
  { href: '', label: 'Add Branch' },
]

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  slug: z.string().min(3, 'Slug is required.'),
  shortName: z.string().optional(),
  address: z.string().min(3, 'Address is required.'),
  hours: z.string().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  prepMinutes: z.coerce.number(),
  isActive: z.boolean().optional(),
})

const AddBranch = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      shortName: '',
      address: '',
      hours: '9:00 AM – 10:00 PM',
      phone: '',
      summary: '',
      prepMinutes: 20,
      isActive: true,
    },
  })

  useEffect(() => {
    const name = form.getValues('name')
    if (name) form.setValue('slug', normalizeSlug(name))
  }, [form.watch('name')])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/branch/create', {
        ...values,
        slug: normalizeSlug(values.slug || values.name),
        prepMinutes: Number(values.prepMinutes) === 10 ? 10 : 20,
        media: selectedMedia[0]?._id || null,
      })
      if (!response.success) throw new Error(response.message)
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
          <h4 className="text-xl font-semibold">Add Branch</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-5">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Saddar Road Branch" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="saddar-road"
                      {...field}
                      onChange={(event) => field.onChange(normalizeSlug(event.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="shortName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short name</FormLabel>
                  <FormControl><Input placeholder="Saddar Road" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="+92 300 1234567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input placeholder="Saddar Road, Faisalabad" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="hours" render={({ field }) => (
                <FormItem>
                  <FormLabel>Counter hours</FormLabel>
                  <FormControl><Input placeholder="9:00 AM – 10:00 PM" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="prepMinutes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Usual prep time</FormLabel>
                  <FormControl>
                    <select className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm" {...field}>
                      <option value={10}>10 minutes</option>
                      <option value={20}>20 minutes</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="summary" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Short note</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="What this counter is known for" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <label className="md:col-span-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={field.value !== false} onChange={(event) => field.onChange(event.target.checked)} />
                  Show this branch on the website
                </label>
              )} />
              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModal open={open} setOpen={setOpen} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} isMultiple={false} />
                {selectedMedia[0] && (
                  <div className="mx-auto mb-3 h-28 w-40 overflow-hidden border">
                    <Image src={selectedMedia[0].url} alt="" width={160} height={112} className="h-full w-full object-cover" />
                  </div>
                )}
                <Button type="button" variant="outline" onClick={() => setOpen(true)}>Select photo</Button>
              </div>
              <div className="md:col-span-2">
                <ButtonLoading loading={loading} type="submit" text="Add Branch" className="cursor-pointer" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBranch
