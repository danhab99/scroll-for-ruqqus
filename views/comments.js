import React from 'react'
import { View } from 'react-native'
import { SubmissionCard } from '../components'
import Style from '../theme'

export default class Comments extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('POST CLIENT', this.props.route.params.post.client)
    this.props.route.params.post.client.APIRequest({ type: "GET", path: `front/comments` }).then(d => console.log('TEST COMMENTS', d))
  }

  render() {
    return  (
      <View style={Style.view}>
        <SubmissionCard post={this.props.route.params.post} />
      </View>
    )
  }
}