import splashImage from '../assets/0.png'

export default function SplashScreen({ onNavigate }) {
    return (
        <div
            className="w-full h-full flex items-center justify-center bg-black cursor-pointer"
            onClick={() => onNavigate('menu')}
        >
            <img
                src={splashImage}
                alt="Splash"
                className="w-full h-full object-cover"
            />
        </div>
    )
}
