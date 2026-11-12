import alchemy from './alchemy'
import ambience from './ambience'
import bars from './bars'
import battery from './battery'
import scope from './scope'

// In the order the "next visualization" button cycles through them
const VISUALIZATIONS = [alchemy, battery, bars, scope, ambience]

export default VISUALIZATIONS
