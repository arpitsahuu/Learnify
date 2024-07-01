import {Schema,model,Document} from "mongoose";

export interface FaqItem extends Document{
    question: string;
    answer: string;
}

export interface Category extends Document{
    title:string;
}


interface Layout extends Document{
    type: string;
    faq: FaqItem[];
    categories: Category[];
}

const faqSchema = new Schema<FaqItem> ({
    question: {type: String},
    answer: {type: String},
});

const categorySchema = new Schema<Category> ({
    title: {type:String},
});


const layoutSchema = new Schema<Layout>({
   type:{type:String},
   faq: [faqSchema],
   categories: [categorySchema],
});

const LayoutModel = model<Layout>('Layout',layoutSchema);

export default LayoutModel;