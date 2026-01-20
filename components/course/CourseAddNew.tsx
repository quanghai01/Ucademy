"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // optional toast for feedback
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ECourseLevel } from "@/app/types/enums";
import slugify from "slugify";
import { createCourse } from "@/app/lib/actions/course.actions";
import { useRouter } from "next/navigation";

const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  desc: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0),
  sale_price: z.number().min(0).optional(),
  level: z.enum(Object.values(ECourseLevel)),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: Partial<CourseFormValues> = {
  title: "",
  slug: "",
  desc: "",
  price: 0,
  sale_price: 0,
  level: ECourseLevel.BEGINNER,
};

export const CourseAddNew: React.FC = () => {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (values: CourseFormValues) => {
    setLoading(true);
    const payload = {
      ...values,
      price: Number(values.price),
      sale_price: Number(values.sale_price),
    };
    try {
      const data = {
        title: payload.title,
        slug:
          payload.slug?.trim() ||
          slugify(payload.title, {
            lower: true,
            locale: "vi",
            strict: true,
            trim: true,
            remove: /[*+~.()'"!:@?/\\#%^&_=,`{}|[\];]/g,
          }),
        desc: payload.desc,
        price: payload.price,
        sale_price: payload.sale_price,
        level: payload.level,
      };

      const res = await createCourse(data);
      if (res?.success) {
        toast.success("Course created successfully!");
      }
      if (res?.data) {
        router.push(`/manage/course/update?slug=${res.data.slug}`);
      }

      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-card rounded-lg shadow-sm"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="course-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Course description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sale Price */}
        <FormField
          control={form.control}
          name="sale_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ECourseLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary  text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow duration-200"
        >
          {loading ? "Saving..." : "Create Course"}
        </Button>
      </form>
    </Form>
  );
};
