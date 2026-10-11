import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#f8f9fa] border-t border-gray-200 py-6 px-8 text-gray-700 text-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              
                <div>
                    <p className="font-normal">
                        বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
                    </p>
                </div>

              
                <div>
                    <p className="font-normal text-right">
                        সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;