/*  SequenceBuilderSequenceWTRP.h
 * Copyright (C) 2014, Alberto Oróñez, all rights reserved.
 *
 * Alphabet Partition enhanced with grammar compression builder
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <utils/libcdsBasics.h>

#include <sequence/SequenceBuilder.h>
#include <bitsequence/BitSequenceBuilder.h>

#ifndef SequenceBuilderSequenceWTRP_H
#define SequenceBuilderSequenceWTRP_H

namespace cds_static
{
	class SequenceBuilderSequenceWTRP : public SequenceBuilder
	{
		public:
			SequenceBuilderSequenceWTRP(SequenceBuilder * groupIndexBuilder, 
									SequenceBuilder * indexBuilder, 
									SequenceBuilder *firstClasses, uint cut, uint cutOffsets);
			virtual ~SequenceBuilderSequenceWTRP();
			virtual Sequence * build(uint * seq, size_t len);
			virtual Sequence * build(const Array & seq);

		protected:
			SequenceBuilder * groupIndexBuilder;
			SequenceBuilder * indexBuilder;
			SequenceBuilder * firstClassesBuilder;
			uint cut;
			uint cutOffsets;
	};
};
#endif
