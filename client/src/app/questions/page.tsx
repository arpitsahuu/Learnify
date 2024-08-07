"use client"
import Navbar from "@/components/Navbar";
import { useGetHeroDataQuery } from "@/Store/layout/layoutApi";
import { useEffect, useRef, useState } from "react";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqsCardProps {
    faqsList: FaqItem;
    idx: number;
}

const FaqsCard: React.FC<FaqsCardProps> = ({ faqsList, idx }) => {
    const answerElRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState(false);
    const [answerH, setAnswerH] = useState('0px');

    const handleOpenAnswer = () => {
        if (answerElRef.current) {
            const answerChild = answerElRef.current.firstElementChild as HTMLElement | null;
            if (answerChild) {
                const answerElH = answerChild.offsetHeight;
                setState(!state);
                setAnswerH(`${answerElH + 20}px`);
            }
        }
    };

    return (
        <div
            className="space-y-3 mt-5 overflow-hidden border-b"
            key={idx}
            onClick={handleOpenAnswer}
        >
            <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
                {faqsList.question}
                {
                    state ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )
                }
            </h4>
            <div
                ref={answerElRef} className="duration-300"
                style={state ? { height: answerH } : { height: '0px' }}
            >
                <div>
                    <p className="text-gray-500">
                        {faqsList.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

const FAQSection: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");

    const { data, isLoading } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true,
    });

  const [questions, setQuestions] = useState<any[]>([]);


    useEffect(() => {
        if (data) {
          setQuestions(data.layout?.faq);
        }
      }, [data]);

    return (
        <div>
            <Navbar
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            ></Navbar>
            <section className="leading-relaxed max-w-screen-xl mt-28 mx-auto px-4 md:px-8 ">

                <div className="space-y-3 text-center">
                    <h1 className="text-3xl text-gray-800 font-semibold">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto text-lg">
                        Answered all frequently asked questions, Still confused? feel free to contact us.
                    </p>
                </div>
                <div className="mt-14 max-w-2xl mx-auto">
                    {
                        questions.map((item, idx) => (
                            <FaqsCard
                                key={idx}
                                idx={idx}
                                faqsList={item}
                            />
                        ))
                    }
                </div>
            </section>
        </div>
    );
}

export default FAQSection;
