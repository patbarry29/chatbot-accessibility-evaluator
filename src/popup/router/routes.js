import Index from './pages/Index'
import Evaluation from './pages/Evaluation'
import RuleContent from './pages/RuleContent'
import Loading from './pages/Loading'

export default [
  {
    path: '/',
    component: Index
  },
  {
    path: '/evaluation',
    name: "evaluation",
    component: Evaluation
  },
  {
    path: '/rule-content',
    name: "rule-content",
    component: RuleContent
  },
  {
    path: '/loading',
    name: "loading",
    component: Loading
  }
]