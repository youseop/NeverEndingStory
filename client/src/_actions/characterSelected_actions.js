import { message } from "antd";
import {
  SELECT_CHARACTER,
  DETACH_CHARACTER,
  PUSH_CHARACTER,
  POP_CHARACTER,
  UPDATE_CHARACTER,
  SET_CHARACTER_LIST,
  ORDER_CHARACTER,
  TOGGLE_CHARACTER,
} from "./types";


export function selectCharacter(character) {
  return {
    type: SELECT_CHARACTER,
    payload: character,
  };
}


export function detachCharacter() {
  return {
    type: DETACH_CHARACTER,
  };
}


export function popCharacter(dataToSubmit) {
  const { oldArray, index } = dataToSubmit;
  let request;
  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i].index === index) {
      // message.info("삭제되었습니다.");
      oldArray.splice(i, 1)
      request = [...oldArray]
      break;
    }
  }

  return {
    type: POP_CHARACTER,
    payload: request,
  };
}


export function pushCharacter(dataToSubmit) {
  const { oldArray, characterSchema } = dataToSubmit;
  let request;
  for (let i = 0; i < oldArray?.length; i++) {
    if (oldArray[i].index === characterSchema.index) {
      request = [
        ...oldArray.slice(0, i),
        {
          ...oldArray[i],
          image: characterSchema.image,
        },
        ...oldArray.slice(i + 1, 4)
      ]
      break;
    }
  }

  if (!request && oldArray?.length >= 3) {
    message.info("인물은 최대 세명까지 추가 가능합니다.");
    request = oldArray;
  }

  request = request ? request : [...(oldArray ? oldArray : []), characterSchema]
  return {
    type: PUSH_CHARACTER,
    payload: request,
  };
}

export function updateCharacter(dataToSubmit) {
  const { oldArray, data, index } = dataToSubmit;
  const request = [
    ...oldArray.slice(0, index),
    {
      ...oldArray[index],
      ...data
    },
    ...oldArray.slice(index + 1, 4)
  ]

  return {
    type: UPDATE_CHARACTER,
    payload: request,
  };
}

export function setCharacterList(dataToSubmit) {
  const { CharacterList } = dataToSubmit;
  const request = CharacterList

  return {
    type: SET_CHARACTER_LIST,
    payload: request,
  };
}

export function orderCharacter(dataToSubmit) {
  const { oldArray, index, num } = dataToSubmit;
  const lastIndex = oldArray.length - 1;
  let request = [...oldArray]
  for (let i = 0; i < lastIndex + 1; i++) {
    if (request[i].index === index) {
      if (num === "double") {
        if (i > 0)
          [request[i], request[0]] = [request[0], request[i]]
      } else if (num === "pull") {
        const tmp = request[i];
        request.splice(i, 1);
        request.push(tmp)
      }
      else if (i > 0) {
        [request[i], request[i - 1]] = [request[i - 1], request[i]]
      }
    }
  }

  return {
    type: ORDER_CHARACTER,
    payload: request,
  };
}



export function toggleCharacter(dataToSubmit) {
  const { oldArray, index } = dataToSubmit;
  let request;
  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i].index === index) {
      oldArray[i].reverse = Math.abs(oldArray[i].reverse - 1);
      request = [...oldArray]
      break;
    }
  }

  return {
    type: POP_CHARACTER,
    payload: request,
  };
}