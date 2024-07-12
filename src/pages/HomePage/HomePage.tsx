import { NavigationComponent } from "../../components/HomePageComponents";

const HomePage = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="container">
        <h1 className="text-center mt-5">
          Welcome to React Voice Controlled File management system
        </h1>
        <p className="text-center mt-3">
          A simple file management system built with React
        </p>
      </div>
    </div>
  );
};

export default HomePage;
