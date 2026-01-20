"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

import { ICourse } from "@/database/course.model";
import { ECourseLevel, ECourseStatus } from "@/app/types/enums";
import { updateCourse } from "@/app/lib/actions/course.actions";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useImmer } from "use-immer";
import ImageUpload from "@/components/common/ImageUpload";

const updateCourseSchema = z.object({
  title: z.string().min(10, "Tên khóa học phải có ít nhất 10 ký tự"),
  slug: z.string().optional(),
  price: z.number().int().positive().optional(),
  sale_price: z.number().int().positive().optional(),
  intro_url: z.string().optional(),
  desc: z.string().optional(),
  image: z.string().optional(),
  views: z.number().int().optional(),
  status: z
    .enum([
      ECourseStatus.APPROVED,
      ECourseStatus.PENDING,
      ECourseStatus.REJECTED,
    ])
    .optional(),
  level: z
    .enum([
      ECourseLevel.BEGINNER,
      ECourseLevel.INTERMEDIATE,
      ECourseLevel.ADVANCED,
    ])
    .optional(),
  info: z.object({
    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    qa: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
  }),
});

type CourseFormValues = z.infer<typeof updateCourseSchema>;

interface CourseUpdateProps {
  course: ICourse;
}
export default function CourseUpdate({ course }: CourseUpdateProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [courseInfo, setCourseInfo] = useImmer({
    requirements: course.info.requirements,
    benefits: course.info.benefits,
    qa: course.info.qa,
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      title: course.title,
      slug: course.slug,
      image: course.image,
      intro_url: course.intro_url,
      desc: course.desc,
      price: course.price ?? 0,
      sale_price: course.sale_price ?? 0,
      status: course.status,
      level: course.level,
      views: course.views ?? 0,
      info: {
        requirements: course.info.requirements ?? [],
        benefits: course.info.benefits ?? [],
        qa: course.info.qa ?? [],
      },
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        sale_price: Number(values.sale_price),
      };

      const res = await updateCourse({
        slug: course.slug,
        updateData: payload,
      });

      if (res.success && values.slug) {
        router.replace(`/manage/course/update?slug=${values.slug}`);
        toast.success("Cập nhật khóa học thành công!");
      } else {
        toast.error(res.message || "Cập nhật thất bại");
      }
      console.log("value", values);
    } catch (error: any) {
      toast.error(error?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên khóa học" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="slug khóa học" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Ảnh thumbnail</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intro_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro video URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="URL video giới thiệu" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      {...field}
                      placeholder="Mô tả chi tiết"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Giá bán</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá gốc</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá khuyến mãi</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Thiết lập */}
        <Card>
          <CardHeader>
            <CardTitle>Thiết lập</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ECourseStatus).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Cấp độ</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ECourseLevel).map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Thông tin khóa học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Requirements */}
            <FormField
              control={form.control}
              name="info.requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row items-center justify-between">
                    <span>Yêu cầu</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newRequirements = [...courseInfo.requirements, ""];
                        setCourseInfo((draft) => {
                          draft.requirements = newRequirements;
                        });
                        field.onChange(newRequirements);
                      }}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-6 w-6 text-green-600" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {courseInfo.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={req}
                            onChange={(e) => {
                              const newRequirements = [...courseInfo.requirements];
                              newRequirements[index] = e.target.value;
                              setCourseInfo((draft) => {
                                draft.requirements = newRequirements;
                              });
                              field.onChange(newRequirements);
                            }}
                            placeholder={`Yêu cầu ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newRequirements = courseInfo.requirements.filter((_, i) => i !== index);
                              setCourseInfo((draft) => {
                                draft.requirements = newRequirements;
                              });
                              field.onChange(newRequirements);
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits */}
            <FormField
              control={form.control}
              name="info.benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row items-center justify-between"><span>Lợi ích</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newBenefit = [...courseInfo.benefits, ""];
                        setCourseInfo((draft) => {
                          draft.benefits = newBenefit;
                        });
                        field.onChange(newBenefit);
                      }}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-6 w-6 text-green-600" />
                    </Button></FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {courseInfo.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={benefit}
                            onChange={(e) => {
                              const newBenefits = [...courseInfo.benefits];
                              newBenefits[index] = e.target.value;
                              setCourseInfo((draft) => {
                                draft.benefits = newBenefits;
                              });
                              field.onChange(newBenefits);
                            }}
                            placeholder={`Lợi ích ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newBenefits = courseInfo.benefits.filter((_, i) => i !== index);
                              setCourseInfo((draft) => {
                                draft.benefits = newBenefits;
                              });
                              field.onChange(newBenefits);
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Q&A */}
            <FormField
              control={form.control}
              name="info.qa"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex flex-row items-center justify-between">
                    <span>Câu hỏi thường gặp</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newQa = [...courseInfo.qa, { question: "", answer: "" }];
                        setCourseInfo((draft) => {
                          draft.qa = newQa;
                        });
                        field.onChange(newQa);
                      }}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-6 w-6 text-green-600" />
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {courseInfo.qa.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={item.question}
                              onChange={(e) => {
                                const newQa = [...courseInfo.qa];
                                newQa[index] = { ...newQa[index], question: e.target.value };
                                setCourseInfo((draft) => {
                                  draft.qa = newQa;
                                });
                                field.onChange(newQa);
                              }}
                              placeholder={`Câu hỏi ${index + 1}`}
                            />
                            <Input
                              value={item.answer}
                              onChange={(e) => {
                                const newQa = [...courseInfo.qa];
                                newQa[index] = { ...newQa[index], answer: e.target.value };
                                setCourseInfo((draft) => {
                                  draft.qa = newQa;
                                });
                                field.onChange(newQa);
                              }}
                              placeholder={`Câu trả lời ${index + 1}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newQa = courseInfo.qa.filter((_, i) => i !== index);
                              setCourseInfo((draft) => {
                                draft.qa = newQa;
                              });
                              field.onChange(newQa);
                            }}
                            className="w-full md:w-auto"
                          >
                            Xóa câu hỏi {index + 1}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>


        </Card>

        <Separator />

        <Button
          onClick={() => { }}
          type="submit"
          disabled={loading}
          className="bg-gradient-primary text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Đang lưu..." : "Cập nhật khóa học"}
        </Button>
      </form>
    </Form>
  );
}
