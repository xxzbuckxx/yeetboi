import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../../apis/firebase";
import Login from "../../components/Login";
import PlayerStat from "../../components/PlayerStat";
import Scoreboard from "../../components/Scoreboard";
import { player, PlayerAttributes } from "../../Game/entities/player";
import "./index.scss";

interface Props {
  navHome: Function;
  navPlay: Function;
}

const Shop: React.FC<Props> = (props: Props) => {
  const { navHome, navPlay } = props;
  const [playerStats, setPlayerStats] = useState<PlayerAttributes>(
    player.getAttributes()
  );
  const { maxHealth, maxCool, maxSpeed, maxPower } = playerStats;

  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  let displayName = "Gerald";
  if (user && user.displayName) {
    displayName = user.displayName;
  }

  const updateSpeed = (val: number) => {
    if (!val) return;

    player.increaseAttrSpeed(val);
    setPlayerStats(player.getAttributes());
  };

  const updateHealth = (val: number) => {
    if (!val) return;

    player.increaseAttrHealth(val);
    setPlayerStats(player.getAttributes());
  };

  const updatePower = (val: number) => {
    if (!val) return;

    player.increaseAttrPower(val);
    setPlayerStats(player.getAttributes());
  };

  const updateCool = (val: number) => {
    if (!val) return;

    player.increaseAttrCool(val);
    setPlayerStats(player.getAttributes());
  };

  return (
    <div className="shop">
      <div className="shop__left">
        <p>Press R to spawn enemy</p>
      </div>
      <div className="shop__right">
        <h2>{displayName}</h2>
        <div className="stats">
          <PlayerStat
            arrowUp={true}
            name={"Speed"}
            value={maxSpeed}
            updateValue={() => updateSpeed(1)}
            cost={15}
          />
          <PlayerStat
            arrowUp={true}
            name={"Health"}
            value={maxHealth}
            updateValue={() => updateHealth(20)}
            cost={5}
          />
          <PlayerStat
            arrowUp={true}
            name={"Power"}
            value={maxPower}
            cost={10}
            updateValue={() => updatePower(10)}
          />
          <PlayerStat
            arrowUp={false}
            name={"Cool"}
            value={maxCool}
            cost={20}
            updateValue={() => updateCool(-10)}
          />
        </div>
        <div className="powerups"></div>
        <button onClick={() => navPlay()} className="play-button">
          Play
        </button>
      </div>
    </div>
  );
};

export default Shop;
