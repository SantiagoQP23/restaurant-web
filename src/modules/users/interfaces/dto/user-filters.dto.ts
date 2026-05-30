import type { PaginationDto } from "@/shared/interfaces/dto/pagination.dto";
import type { SearchDto } from "@/shared/interfaces/dto/search.dto";

export interface UserFiltersDto extends PaginationDto, SearchDto {}
