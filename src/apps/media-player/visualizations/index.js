import alchemy from './alchemy'
import ambience from './ambience'
import bars from './bars'
import battery from './battery'
import scope from './scope'

// In the order the "next visualization" button cycles through them; the first is the one the player starts with
const VISUALIZATIONS = [battery, alchemy, bars, scope, ambience]

export default VISUALIZATIONS
