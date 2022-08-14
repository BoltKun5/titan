import axios from "axios";
import * as fs from "fs";

export const getSetIcons = async () => {
  for (const name of ["a"]) {
    const URL = `https://www.pokecardex.com/assets/images/symboles/${name}.png`;
    try {
      const res = await axios.get(URL, {
        responseType: 'arraybuffer',
      });
      if (!fs.existsSync(`./img`))
        fs.mkdirSync(`./img`)
      fs.writeFileSync(`./img/${name}.png`, Buffer.from(res.data as any));
    } catch (e) {
      break;
    }
  }
}

export const renameImages = (setCode: string, startIndex: number, endIndex: number, newNamePrefix: string) => {
  if (!fs.existsSync(`./img`))
    fs.mkdirSync(`./img`)

  for (let i = startIndex; i <= endIndex; i++) {
    try {
      fs.renameSync(`./img/${setCode}/${i}.jpg`, `./img/${setCode}/${newNamePrefix}${String(i - 186).padStart(2, "0")}.jpg`);
    } catch (e) {
      console.log(e)
    }
  }
}
