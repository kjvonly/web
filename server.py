from flask import Flask, send_file, make_response, send_from_directory
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

m = {
'1_1': True,
'1_2': True,
'1_3': True,
'1_4': True,
'1_5': True,
'1_6': True,
'1_7': True,
'1_8': True,
'1_9': True,
'1_10': True,
'1_11': True,
'1_12': True,
'1_13': True,
'1_14': True,
'1_15': True,
'1_16': True,
'1_17': True,
'1_18': True,
'1_19': True,
'1_20': True,
'1_21': True,
'1_22': True,
'1_23': True,
'1_24': True,
'1_25': True,
'1_26': True,
'1_27': True,
'1_28': True,
'1_29': True,
'1_30': True,
'1_31': True,
'1_32': True,
'1_33': True,
'1_34': True,
'1_35': True,
'1_36': True,
'1_37': True,
'1_38': True,
'1_39': True,
'1_40': True,
'1_41': True,
'1_42': True,
'1_43': True,
'1_44': True,
'1_45': True,
'1_46': True,
'1_47': True,
'1_48': True,
'1_49': True,
'1_50': True,
'2_1': True,
'2_2': True,
'2_3': True,
'2_4': True,
'2_5': True,
'2_6': True,
'2_7': True,
'2_8': True,
'2_9': True,
'2_10': True,
'2_11': True,
'2_12': True,
'2_13': True,
'2_14': True,
'2_15': True,
'2_16': True,
'2_17': True,
'2_18': True,
'2_19': True,
'2_20': True,
'2_21': True,
'2_22': True,
'2_23': True,
'2_24': True,
'2_25': True,
'2_26': True,
'2_27': True,
'2_28': True,
'2_29': True,
'2_30': True,
'2_31': True,
'2_32': True,
'2_33': True,
'2_34': True,
'2_35': True,
'2_36': True,
'2_37': True,
'2_38': True,
'2_39': True,
'2_40': True,
'3_1': True,
'3_2': True,
'3_3': True,
'3_4': True,
'3_5': True,
'3_6': True,
'3_7': True,
'3_8': True,
'3_9': True,
'3_10': True,
'3_11': True,
'3_12': True,
'3_13': True,
'3_14': True,
'3_15': True,
'3_16': True,
'3_17': True,
'3_18': True,
'3_19': True,
'3_20': True,
'3_21': True,
'3_22': True,
'3_23': True,
'3_24': True,
'3_25': True,
'3_26': True,
'3_27': True,
'4_1': True,
'4_2': True,
'4_3': True,
'4_4': True,
'4_5': True,
'4_6': True,
'4_7': True,
'4_8': True,
'4_9': True,
'4_10': True,
'4_11': True,
'4_12': True,
'4_13': True,
'4_14': True,
'4_15': True,
'4_16': True,
'4_17': True,
'4_18': True,
'4_19': True,
'4_20': True,
'4_21': True,
'4_22': True,
'4_23': True,
'4_24': True,
'4_25': True,
'4_26': True,
'4_27': True,
'4_28': True,
'4_29': True,
'4_30': True,
'4_31': True,
'4_32': True,
'4_33': True,
'4_34': True,
'4_35': True,
'4_36': True,
'5_1': True,
'5_2': True,
'5_3': True,
'5_4': True,
'5_5': True,
'5_6': True,
'5_7': True,
'5_8': True,
'5_9': True,
'5_10': True,
'5_11': True,
'5_12': True,
'5_13': True,
'5_14': True,
'5_15': True,
'5_16': True,
'5_17': True,
'5_18': True,
'5_19': True,
'5_20': True,
'5_21': True,
'5_22': True,
'5_23': True,
'5_24': True,
'5_25': True,
'5_26': True,
'5_27': True,
'5_28': True,
'5_29': True,
'5_30': True,
'5_31': True,
'5_32': True,
'5_33': True,
'5_34': True,
'6_1': True,
'6_2': True,
'6_3': True,
'6_4': True,
'6_5': True,
'6_6': True,
'6_7': True,
'6_8': True,
'6_9': True,
'6_10': True,
'6_11': True,
'6_12': True,
'6_13': True,
'6_14': True,
'6_15': True,
'6_16': True,
'6_17': True,
'6_18': True,
'6_19': True,
'6_20': True,
'6_21': True,
'6_22': True,
'6_23': True,
'6_24': True,
'7_1': True,
'7_2': True,
'7_3': True,
'7_4': True,
'7_5': True,
'7_6': True,
'7_7': True,
'7_8': True,
'7_9': True,
'7_10': True,
'7_11': True,
'7_12': True,
'7_13': True,
'7_14': True,
'7_15': True,
'7_16': True,
'7_17': True,
'7_18': True,
'7_19': True,
'7_20': True,
'7_21': True,
'8_1': True,
'8_2': True,
'8_3': True,
'8_4': True,
'9_1': True,
'9_2': True,
'9_3': True,
'9_4': True,
'9_5': True,
'9_6': True,
'9_7': True,
'9_8': True,
'9_9': True,
'9_10': True,
'9_11': True,
'9_12': True,
'9_13': True,
'9_14': True,
'9_15': True,
'9_16': True,
'9_17': True,
'9_18': True,
'9_19': True,
'9_20': True,
'9_21': True,
'9_22': True,
'9_23': True,
'9_24': True,
'9_25': True,
'9_26': True,
'9_27': True,
'9_28': True,
'9_29': True,
'9_30': True,
'9_31': True,
'10_1': True,
'10_2': True,
'10_3': True,
'10_4': True,
'10_5': True,
'10_6': True,
'10_7': True,
'10_8': True,
'10_9': True,
'10_10': True,
'10_11': True,
'10_12': True,
'10_13': True,
'10_14': True,
'10_15': True,
'10_16': True,
'10_17': True,
'10_18': True,
'10_19': True,
'10_20': True,
'10_21': True,
'10_22': True,
'10_23': True,
'10_24': True,
'11_1': True,
'11_2': True,
'11_3': True,
'11_4': True,
'11_5': True,
'11_6': True,
'11_7': True,
'11_8': True,
'11_9': True,
'11_10': True,
'11_11': True,
'11_12': True,
'11_13': True,
'11_14': True,
'11_15': True,
'11_16': True,
'11_17': True,
'11_18': True,
'11_19': True,
'11_20': True,
'11_21': True,
'11_22': True,
'12_1': True,
'12_2': True,
'12_3': True,
'12_4': True,
'12_5': True,
'12_6': True,
'12_7': True,
'12_8': True,
'12_9': True,
'12_10': True,
'12_11': True,
'12_12': True,
'12_13': True,
'12_14': True,
'12_15': True,
'12_16': True,
'12_17': True,
'12_18': True,
'12_19': True,
'12_20': True,
'12_21': True,
'12_22': True,
'12_23': True,
'12_24': True,
'12_25': True,
'13_1': True,
'13_2': True,
'13_3': True,
'13_4': True,
'13_5': True,
'13_6': True,
'13_7': True,
'13_8': True,
'13_9': True,
'13_10': True,
'13_11': True,
'13_12': True,
'13_13': True,
'13_14': True,
'13_15': True,
'13_16': True,
'13_17': True,
'13_18': True,
'13_19': True,
'13_20': True,
'13_21': True,
'13_22': True,
'13_23': True,
'13_24': True,
'13_25': True,
'13_26': True,
'13_27': True,
'13_28': True,
'13_29': True,
'14_1': True,
'14_2': True,
'14_3': True,
'14_4': True,
'14_5': True,
'14_6': True,
'14_7': True,
'14_8': True,
'14_9': True,
'14_10': True,
'14_11': True,
'14_12': True,
'14_13': True,
'14_14': True,
'14_15': True,
'14_16': True,
'14_17': True,
'14_18': True,
'14_19': True,
'14_20': True,
'14_21': True,
'14_22': True,
'14_23': True,
'14_24': True,
'14_25': True,
'14_26': True,
'14_27': True,
'14_28': True,
'14_29': True,
'14_30': True,
'14_31': True,
'14_32': True,
'14_33': True,
'14_34': True,
'14_35': True,
'14_36': True,
'15_1': True,
'15_2': True,
'15_3': True,
'15_4': True,
'15_5': True,
'15_6': True,
'15_7': True,
'15_8': True,
'15_9': True,
'15_10': True,
'16_1': True,
'16_2': True,
'16_3': True,
'16_4': True,
'16_5': True,
'16_6': True,
'16_7': True,
'16_8': True,
'16_9': True,
'16_10': True,
'16_11': True,
'16_12': True,
'16_13': True,
'19_1': True,
'19_2': True,
'19_3': True,
'19_4': True,
'19_5': True,
'19_6': True,
'19_7': True,
'19_8': True,
'19_9': True,
'19_10': True,
'22_1': True,
'22_2': True,
'22_3': True,
'22_4': True,
'22_5': True,
'22_6': True,
'22_7': True,
'22_8': True,
'22_9': True,
'22_10': True,
'22_11': True,
'22_12': True,
'22_13': True,
'22_14': True,
'22_15': True,
'22_16': True,
'22_17': True,
'22_18': True,
'22_19': True,
'22_20': True,
'22_21': True,
'22_22': True,
'22_23': True,
'22_24': True,
'22_25': True,
'22_26': True,
'22_27': True,
'22_28': True,
'22_29': True,
'22_30': True,
'22_31': True,
'22_32': True,
'22_33': True,
'22_34': True,
'22_35': True,
'22_36': True,
'22_37': True,
'22_38': True,
'22_39': True,
'22_40': True,
'22_41': True,
'22_42': True,
'23_1': True,
'23_2': True,
'23_3': True,
'23_4': True,
'23_5': True,
'23_6': True,
'23_7': True,
'23_8': True,
'23_9': True,
'23_10': True,
'23_11': True,
'23_12': True,
'23_13': True,
'23_14': True,
'23_15': True,
'23_16': True,
'23_17': True,
'23_18': True,
'23_19': True,
'23_20': True,
'23_21': True,
'23_22': True,
'23_23': True,
'23_24': True,
'23_25': True,
'23_26': True,
'23_27': True,
'23_28': True,
'23_29': True,
'23_30': True,
'23_31': True,
'23_32': True,
'23_33': True,
'23_34': True,
'23_35': True,
'23_36': True,
'23_37': True,
'23_38': True,
'23_39': True,
'23_40': True,
'23_41': True,
'23_42': True,
'23_43': True,
'23_44': True,
'23_45': True,
'23_46': True,
'23_47': True,
'23_48': True,
'23_49': True,
'23_50': True,
'23_51': True,
'23_52': True,
'23_53': True,
'23_54': True,
'23_55': True,
'23_56': True,
'23_57': True,
'23_58': True,
'23_59': True,
'23_60': True,
'23_61': True,
'23_62': True,
'23_63': True,
'23_64': True,
'23_65': True,
'23_66': True,
'23_67': True,
'23_68': True,
'23_69': True,
'23_70': True,
'23_71': True,
'23_72': True,
'23_73': True,
'23_74': True,
'23_75': True,
'23_76': True,
'23_77': True,
'23_78': True,
'23_79': True,
'23_80': True,
'23_81': True,
'23_82': True,
'23_83': True,
'23_84': True,
'23_85': True,
'23_86': True,
'23_87': True,
'23_88': True,
'23_89': True,
'23_90': True,
'23_91': True,
'23_92': True,
'23_93': True,
'23_94': True,
'23_95': True,
'23_96': True,
'23_97': True,
'23_98': True,
'23_99': True,
'23_100': True,
'23_101': True,
'23_102': True,
'23_103': True,
'23_104': True,
'23_105': True,
'23_106': True,
'23_107': True,
'23_108': True,
'23_109': True,
'23_110': True,
'23_111': True,
'23_112': True,
'23_113': True,
'23_114': True,
'23_115': True,
'23_116': True,
'23_117': True,
'23_118': True,
'23_119': True,
'23_120': True,
'23_121': True,
'23_122': True,
'23_123': True,
'23_124': True,
'23_125': True,
'23_126': True,
'23_127': True,
'23_128': True,
'23_129': True,
'23_130': True,
'23_131': True,
'23_132': True,
'23_133': True,
'23_134': True,
'23_135': True,
'23_136': True,
'23_137': True,
'23_138': True,
'23_139': True,
'23_140': True,
'23_141': True,
'23_142': True,
'23_143': True,
'23_144': True,
'23_145': True,
'23_146': True,
'23_147': True,
'23_148': True,
'23_149': True,
'23_150': True,
'24_1': True,
'24_2': True,
'24_3': True,
'24_4': True,
'24_5': True,
'24_6': True,
'24_7': True,
'24_8': True,
'24_9': True,
'24_10': True,
'24_11': True,
'24_12': True,
'24_13': True,
'24_14': True,
'24_15': True,
'24_16': True,
'24_17': True,
'24_18': True,
'24_19': True,
'24_20': True,
'24_21': True,
'24_22': True,
'24_23': True,
'24_24': True,
'24_25': True,
'24_26': True,
'24_27': True,
'24_28': True,
'24_29': True,
'24_30': True,
'24_31': True,
'25_1': True,
'25_2': True,
'25_3': True,
'25_4': True,
'25_5': True,
'25_6': True,
'25_7': True,
'25_8': True,
'25_9': True,
'25_10': True,
'25_11': True,
'25_12': True,
'26_1': True,
'26_2': True,
'26_3': True,
'26_4': True,
'26_5': True,
'26_6': True,
'26_7': True,
'26_8': True,
'29_1': True,
'29_2': True,
'29_3': True,
'29_4': True,
'29_5': True,
'29_6': True,
'29_7': True,
'29_8': True,
'29_9': True,
'29_10': True,
'29_11': True,
'29_12': True,
'29_13': True,
'29_14': True,
'29_15': True,
'29_16': True,
'29_17': True,
'29_18': True,
'29_19': True,
'29_20': True,
'29_21': True,
'29_22': True,
'29_23': True,
'29_24': True,
'29_25': True,
'29_26': True,
'29_27': True,
'29_28': True,
'29_29': True,
'29_30': True,
'29_31': True,
'29_32': True,
'29_33': True,
'29_34': True,
'29_35': True,
'29_36': True,
'29_37': True,
'29_38': True,
'29_39': True,
'29_40': True,
'29_41': True,
'29_42': True,
'29_43': True,
'29_44': True,
'29_45': True,
'29_46': True,
'29_47': True,
'29_48': True,
'29_49': True,
'29_50': True,
'29_51': True,
'29_52': True,
'29_53': True,
'29_54': True,
'29_55': True,
'29_56': True,
'29_57': True,
'29_58': True,
'29_59': True,
'29_60': True,
'29_61': True,
'29_62': True,
'29_63': True,
'29_64': True,
'29_65': True,
'29_66': True,
'30_1': True,
'30_2': True,
'30_3': True,
'30_4': True,
'30_5': True,
'30_6': True,
'30_7': True,
'30_8': True,
'30_9': True,
'30_10': True,
'30_11': True,
'30_12': True,
'30_13': True,
'30_14': True,
'30_15': True,
'30_16': True,
'30_17': True,
'30_18': True,
'30_19': True,
'30_20': True,
'30_21': True,
'30_22': True,
'30_23': True,
'30_24': True,
'30_25': True,
'30_26': True,
'30_27': True,
'30_28': True,
'30_29': True,
'30_30': True,
'30_31': True,
'30_32': True,
'30_33': True,
'30_34': True,
'30_35': True,
'30_36': True,
'30_37': True,
'30_38': True,
'30_39': True,
'30_40': True,
'30_41': True,
'30_42': True,
'30_43': True,
'30_44': True,
'30_45': True,
'30_46': True,
'30_47': True,
'30_48': True,
'30_49': True,
'30_50': True,
'30_51': True,
'30_52': True,
'31_1': True,
'31_2': True,
'31_3': True,
'31_4': True,
'31_5': True,
'33_1': True,
'33_2': True,
'33_3': True,
'33_4': True,
'33_5': True,
'33_6': True,
'33_7': True,
'33_8': True,
'33_9': True,
'33_10': True,
'33_11': True,
'33_12': True,
'33_13': True,
'33_14': True,
'33_15': True,
'33_16': True,
'33_17': True,
'33_18': True,
'33_19': True,
'33_20': True,
'33_21': True,
'33_22': True,
'33_23': True,
'33_24': True,
'33_25': True,
'33_26': True,
'33_27': True,
'33_28': True,
'33_29': True,
'33_30': True,
'33_31': True,
'33_32': True,
'33_33': True,
'33_34': True,
'33_35': True,
'33_36': True,
'33_37': True,
'33_38': True,
'33_39': True,
'33_40': True,
'33_41': True,
'33_42': True,
'33_43': True,
'33_44': True,
'33_45': True,
'33_46': True,
'33_47': True,
'33_48': True,
'34_1': True,
'34_2': True,
'34_3': True,
'34_4': True,
'34_5': True,
'34_6': True,
'34_7': True,
'34_8': True,
'34_9': True,
'34_10': True,
'34_11': True,
'34_12': True,
'35_1': True,
'35_2': True,
'35_3': True,
'35_4': True,
'35_5': True,
'35_6': True,
'35_7': True,
'35_8': True,
'35_9': True,
'35_10': True,
'35_11': True,
'35_12': True,
'35_13': True,
'35_14': True,
'36_1': True,
'36_2': True,
'36_3': True,
'37_1': True,
'37_2': True,
'37_3': True,
'37_4': True,
'37_5': True,
'37_6': True,
'37_7': True,
'37_8': True,
'37_9': True,
'38_1': True,
'39_1': True,
'39_2': True,
'39_3': True,
'39_4': True,
'40_1': True,
'40_2': True,
'40_3': True,
'40_4': True,
'40_5': True,
'40_6': True,
'40_7': True,
'41_1': True,
'41_2': True,
'41_3': True,
'42_1': True,
'42_2': True,
'42_3': True,
'43_1': True,
'43_2': True,
'43_3': True,
'44_1': True,
'44_2': True,
'45_1': True,
'45_2': True,
'45_3': True,
'45_4': True,
'45_5': True,
'45_6': True,
'45_7': True,
'45_8': True,
'45_9': True,
'45_10': True,
'45_11': True,
'45_12': True,
'45_13': True,
'45_14': True,
'46_1': True,
'46_2': True,
'46_3': True,
'46_4': True,
'47_1': True,
'47_2': True,
'47_3': True,
'47_4': True,
'47_5': True,
'47_6': True,
'47_7': True,
'47_8': True,
'47_9': True,
'47_10': True,
'47_11': True,
'47_12': True,
'47_13': True,
'47_14': True,
'47_15': True,
'47_16': True,
'47_17': True,
'47_18': True,
'47_19': True,
'47_20': True,
'47_21': True,
'47_22': True,
'47_23': True,
'47_24': True,
'47_25': True,
'47_26': True,
'47_27': True,
'47_28': True,
'48_1': True,
'48_2': True,
'48_3': True,
'48_4': True,
'48_5': True,
'48_6': True,
'48_7': True,
'48_8': True,
'48_9': True,
'48_10': True,
'48_11': True,
'48_12': True,
'48_13': True,
'48_14': True,
'48_15': True,
'48_16': True,
'49_1': True,
'49_2': True,
'49_3': True,
'49_4': True,
'49_5': True,
'49_6': True,
'49_7': True,
'49_8': True,
'49_9': True,
'49_10': True,
'49_11': True,
'49_12': True,
'49_13': True,
'49_14': True,
'49_15': True,
'49_16': True,
'49_17': True,
'49_18': True,
'49_19': True,
'49_20': True,
'49_21': True,
'49_22': True,
'49_23': True,
'49_24': True,
'50_1': True,
'50_2': True,
'50_3': True,
'50_4': True,
'50_5': True,
'50_6': True,
'50_7': True,
'50_8': True,
'50_9': True,
'50_10': True,
'50_11': True,
'50_12': True,
'50_13': True,
'50_14': True,
'50_15': True,
'50_16': True,
'50_17': True,
'50_18': True,
'50_19': True,
'50_20': True,
'50_21': True,
'51_1': True,
'51_2': True,
'51_3': True,
'51_4': True,
'51_5': True,
'51_6': True,
'51_7': True,
'51_8': True,
'51_9': True,
'51_10': True,
'51_11': True,
'51_12': True,
'51_13': True,
'51_14': True,
'51_15': True,
'51_16': True,
'51_17': True,
'51_18': True,
'51_19': True,
'51_20': True,
'51_21': True,
'51_22': True,
'51_23': True,
'51_24': True,
'51_25': True,
'51_26': True,
'51_27': True,
'51_28': True,
'52_1': True,
'52_2': True,
'52_3': True,
'52_4': True,
'52_5': True,
'52_6': True,
'52_7': True,
'52_8': True,
'52_9': True,
'52_10': True,
'52_11': True,
'52_12': True,
'52_13': True,
'52_14': True,
'52_15': True,
'52_16': True,
'53_1': True,
'53_2': True,
'53_3': True,
'53_4': True,
'53_5': True,
'53_6': True,
'53_7': True,
'53_8': True,
'53_9': True,
'53_10': True,
'53_11': True,
'53_12': True,
'53_13': True,
'53_14': True,
'53_15': True,
'53_16': True,
'54_1': True,
'54_2': True,
'54_3': True,
'54_4': True,
'54_5': True,
'54_6': True,
'54_7': True,
'54_8': True,
'54_9': True,
'54_10': True,
'54_11': True,
'54_12': True,
'54_13': True,
'55_1': True,
'55_2': True,
'55_3': True,
'55_4': True,
'55_5': True,
'55_6': True,
'56_1': True,
'56_2': True,
'56_3': True,
'56_4': True,
'56_5': True,
'56_6': True,
'57_1': True,
'57_2': True,
'57_3': True,
'57_4': True,
'58_1': True,
'58_2': True,
'58_3': True,
'58_4': True,
'59_1': True,
'59_2': True,
'59_3': True,
'59_4': True,
'59_5': True,
'60_1': True,
'60_2': True,
'60_3': True,
'61_1': True,
'61_2': True,
'61_3': True,
'61_4': True,
'61_5': True,
'61_6': True,
'62_1': True,
'62_2': True,
'62_3': True,
'62_4': True,
'63_1': True,
'63_2': True,
'63_3': True,
'64_1': True,
'65_1': True,
'65_2': True,
'65_3': True,
'65_4': True,
'65_5': True,
'65_6': True,
'65_7': True,
'65_8': True,
'65_9': True,
'65_10': True,
'65_11': True,
'65_12': True,
'65_13': True,
'66_1': True,
'66_2': True,
'66_3': True,
'66_4': True,
'66_5': True,
'67_1': True,
'67_2': True,
'67_3': True,
'67_4': True,
'67_5': True,
'68_1': True,
'68_2': True,
'68_3': True,
'69_1': True,
'69_2': True,
'69_3': True,
'69_4': True,
'69_5': True,
'70_1': True,
'71_1': True,
'72_1': True,
'73_1': True,
'73_2': True,
'73_3': True,
'73_4': True,
'73_5': True,
'73_6': True,
'73_7': True,
'73_8': True,
'73_9': True,
'73_10': True,
'73_11': True,
'73_12': True,
'73_13': True,
'73_14': True,
'73_15': True,
'73_16': True,
'73_17': True,
'73_18': True,
'73_19': True,
'73_20': True,
'73_21': True,
'73_22': True,
'all': True,
'booknames': True,
}

@app.route("/api/<id>")
def all(id):
    if not id in m:
        return make_response('file not found', 404)

    response = make_response( send_file("../data/json.gz/" +  id + ".json.gz"))
    response.headers['Content-Type'] = 'application/json'
    response.headers['Content-Encoding'] = 'gzip'
    return response

@app.route("/")
def home():
    return send_from_directory('build', "index.html")


# Route to add static files (CSS and JS)
@app.route("/<path:path>")
def base(path):
    if os.path.exists(os.path.join('build', path)):
        return send_from_directory('build', path)
    else:
       return send_from_directory('build', 'index.html')


if __name__ == '__main__':
    app.run(host="localhost", port=5000)