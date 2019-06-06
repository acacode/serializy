
const ServerData = {
  DeepInfo: {
    BadHabits: ['Coffee', 'Development']
  },
  Family: {
    ChildrenCount: 0,
    Spouse: false,
  },
  FirstName: 'Sergey',
  ID: '1CASSD@D#@Dd2d@2dDFC',
  Job: {
    Exp: 4,
    Skills: ['JavaScript', 'ReactJS', 'NodeJS']
  },
  LastName: 'Volkov',
}

const ClientData = {
  badHabits: ['Coffee', 'Development'],
  family: {
    childCount: 0,
    spouse: false,
  },
  firstName: 'Sergey',
  id: '1CASSD@D#@Dd2d@2dDFC',
  job: {
    experience: 4,
    skills: ['JavaScript', 'ReactJS', 'NodeJS']
  },
  lastName: 'Volkov',
}

const structProp = (a: any) => {}

// class FamilyInfo {
//   public childCount = structProp()
// }

class Profile {
  public badHabits = structProp(({ DeepInfo }) => DeepInfo.BadHabits)
  public family = structProp(({ DeepInfo }) => DeepInfo.BadHabits)
}
