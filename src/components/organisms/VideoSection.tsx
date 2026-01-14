import { useTranslation } from 'next-i18next';
import VideoCard from "../moleculs/VideoCard";

export default function VideoSection() {
    const { t } = useTranslation('video');
    
    const videoList = [
        { 
            title: t('videos.companyProfile.title'), 
            desc: t('videos.companyProfile.description'), 
            videoUrl: "https://www.youtube.com/embed/UQ2Eg-XG9zM"
        },
        // { 
        //     title: t('videos.companyProfile.title'), 
        //     desc: t('videos.companyProfile.description'), 
        //     videoUrl: "https://www.youtube.com/embed/UQ2Eg-XG9zM"
        // },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoList.map((item, index) => (
                <VideoCard key={index} title={item.title} description={item.desc} videoUrl={item.videoUrl} />
            ))}
        </div>
    );
}
