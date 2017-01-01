// Schema
// ==========================================

const schema = {
  headline: {
    type: 'text',
    properties: {
      fontFamily: ['Lato', 'Playfair Display', 'Fira Sans'],
      fontSize: ['3rem'],
      fontWeight: ['600'],
      fontStyle: ['normal'],
      textAlign: ['left'],
      textTransform: ['none', 'uppercase'],
      color: ['#333', 'mediumblue'],
      lineHeight: ['1.2'],
      marginBottom: ['8px'],
      letterSpacing: ['-0.025em'],
      text: ['Guns, Germs, and Steel'],
      // textShadow: ['none'],
      // borderRadius: ['0'],
      // boxShadow: ['none'],
      // padding: ['none'],
      // background: ['none'],
      // backgroundImage: ['none'],
      // backgroundBlendMode: ['none'],
      // display: ['block'],
    },
  },
  subheadline: {
    type: 'text',
    properties: {
      fontFamily: ['sans-serif'],
      fontSize: ['1rem'],
      fontWeight: ['400'],
      fontStyle: ['italic'],
      textAlign: ['left'],
      textTransform: ['none'],
      color: ['#666'],
      lineHeight: ['1.2'],
      marginBottom: ['1.5rem'],
      letterSpacing: ['0'],
      text: ['by Jared Diamond'],
    },
  },
  description: {
    type: 'text',
    properties: {
      fontFamily: ['Roboto', 'Crimson'],
      fontSize: ['1rem'],
      fontWeight: ['400'],
      fontStyle: ['normal'],
      textAlign: ['left'],
      textTransform: ['none'],
      color: ['#333'],
      lineHeight: ['1.5'],
      marginBottom: ['0'],
      letterSpacing: ['0'],
      text: [
        'In the 1930s, the Annales School in France undertook the study of long-term historical structures by using a synthesis of geography, history, and sociology. Scholars examined the impact of geography, climate, and land use. Although geography had been nearly eliminated as an academic discipline in the United States after the 1960s, several geography-based historical theories were published in the 1990s.',
      ],
    },
  },
};

export default schema;
