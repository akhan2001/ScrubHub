import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  col: {
    flexDirection: 'column',
  },
  border: {
    borderWidth: 1,
    borderColor: '#000',
  },
  cell: {
    padding: 6,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  valueBox: {
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 20,
    marginTop: 4,
    padding: 4,
  },
  paragraph: {
    marginBottom: 4,
    lineHeight: 1,
  },
  paragraphBold: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 16,
    fontSize: 8,
    color: '#666',
  },
  signatureRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 80,
  },
  signatureValue: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingBottom: 2,
    minHeight: 16,
  },
  checkboxGroup: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  twoColHeading: {
    width: '28%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    marginRight: 0,
  },
  twoColContent: {
    width: '72%',
    paddingLeft: 12,
    paddingTop: 4,
    paddingBottom: 12,
  },
  twoColRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  sigDateRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  sigBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 40,
    padding: 6,
  },
  dateBox: {
    width: 120,
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 40,
    padding: 6,
  },
  deliveryRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
    alignItems: 'center',
  },
});
