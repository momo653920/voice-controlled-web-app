import { NavigationComponent } from "../../components/HomePageComponents";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <NavigationComponent />
      <div className="top-section">
        <div className="centered-content">
          <h1>Опростете работата си!</h1>
          <p>
            Открийте как нашият инструмент може да ускори задачите ви. Опростете
            работния си процес и се концентрирайте върху най-важното.
          </p>
          <div className="button-group">
            <Link to="/register">
              <button className="btn btn-primary">
                Регистрирайте се безплатно
                <span className="arrow">→</span>
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn btn-secondary">Отидете на таблото</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <div className="description">
          <h3>За проекта</h3>
          <p>
            Добре дошли в Jessica. Това иновационно приложение позволява на
            потребителите да управляват файловете си чрез гласови команди,
            предоставяйки ефективна форма на организация и достъп до документи.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
