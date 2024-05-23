// components/FAQAccordion.js

const FAQAccordion = () => {
  const faqData = [
    {
      question: "How to convert YouTube video to MP3?",
      answer: "To convert a YouTube video to MP3, simply copy the video URL and paste it into the conversion box on YouTubeToMP3.Tube. Click the 'Convert' button to start the conversion process.",
    },
    {
      question: 'What is YouTubeToMP3.Tube?',
      answer: 'YouTubeToMP3.Tube is a free online tool that allows you to convert YouTube videos to MP3 files quickly and easily.',
    },
    {
      question: 'Is it legal to convert YouTube videos to MP3?',
      answer: 'The legality of converting YouTube videos to MP3 depends on the content and its copyright status. Ensure you have the right to download and convert the video.',
    },
    {
      question: 'Do I need to install any software?',
      answer: 'No, YouTubeToMP3.Tube is a web-based tool, so you don\'t need to install any software. Simply visit our website and start converting.',
    },
    {
      question: 'Are there any limitations on the number of conversions?',
      answer: 'There are no limitations on the number of conversions. You can convert as many YouTube videos to MP3 as you like.',
    },
    {
      question: 'What formats are supported?',
      answer: 'Currently, YouTubeToMP3.Tube supports MP3 format for audio conversions.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we prioritize your privacy and security. Our website uses encryption to protect your data during the conversion process.',
    },
    {
      question: 'Can I use YouTubeToMP3.Tube on my mobile device?',
      answer: 'Yes, our website is mobile-friendly and works seamlessly on smartphones and tablets.',
    },
    {
      question: 'What is the quality of the converted MP3 files?',
      answer: 'We ensure high-quality MP3 files by preserving the original sound quality of the YouTube video.',
    },
    {
      question: 'How long does the conversion process take?',
      answer: 'The conversion process is usually quick and depends on the length of the YouTube video. Most conversions are completed within a few minutes.',
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div id="accordion-root">
        {faqData.map((faq, index) => (
          <details key={index} className="accordion-item">
            <summary className="accordion-trigger">{faq.question}</summary>
            <div className="accordion-content">{faq.answer}</div>
          </details>
        ))}
      </div>
      <style jsx>{`
        .accordion-item {
          border: 1px solid #ccc;
          margin-bottom: 10px;
          padding: 10px;
        }
        .accordion-trigger {
          cursor: pointer;
          padding: 10px;
          text-align: left;
          outline: none;
          border: none;
          width: 100%;
        }
        .accordion-content {
          padding: 10px;
          background-color: white;
          border-top: 1px solid #ccc;
        }
      `}</style>
    </>
  );
};

export default FAQAccordion;
