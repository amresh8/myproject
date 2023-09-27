<?php
/**
 * @author Sujith Haridasan <sharidasan@owncloud.com>
 * @copyright (C) 2019 ownCloud GmbH
 * @license ownCloud Commercial License
 *
 * This code is covered by the ownCloud Commercial License.
 *
 * You should have received a copy of the ownCloud Commercial License
 * along with this program. If not, see <https://owncloud.com/licenses/owncloud-commercial/>.
 *
 */

namespace OCA\Metrics\Metrics;

use Doctrine\DBAL\Platforms\OraclePlatform;
use OCP\Files\IRootFolder;
use OCP\IConfig;
use OCP\IDBConnection;

class QuotaMetrics {

	/**
	 * @var IRootFolder
	 */
	private $rootFolder;

	/**
	 * @var IDBConnection
	 */
	private $dbConnection;

	/** @var IConfig */
	private $config;

	/**
	 * QuotaMetrics constructor.
	 *
	 * @param IRootFolder $rootFolder
	 * @param IDBConnection $dbConnection
	 * @param IConfig $config
	 */
	public function __construct(
		IRootFolder $rootFolder,
		IDBConnection $dbConnection,
		IConfig $config
	) {
		$this->rootFolder = $rootFolder;
		$this->dbConnection = $dbConnection;
		$this->config = $config;
	}

	/**
	 * Provides total quota used and available
	 *
	 * @return array
	 */
	public function getTotalQuotaUsage(): array {
		$used = $this->getUsedSpace();
		$free = $this->rootFolder->getFreeSpace();

		// check if objectstorage is configured, as there the total space is available as config parameter
		$objectStorageConfig = $this->config->getSystemValue('objectstore', null);
		if ($objectStorageConfig && isset($objectStorageConfig['arguments']['availableStorage'])) {
			$free = $objectStorageConfig['arguments']['availableStorage'] - $used;
		}

		// when free is negative it is one of the
		// FileInfo::SPACE_NOT_COMPUTED, FileInfo::SPACE_UNKNOWN, FileInfo::SPACE_UNLIMITED etc.
		if ($free < 0) {
			$free = 0;
		}

		return [
			'used' => $used,
			'total' => $free + $used,
			'free' => $free,
			'relative' => 0,
		];
	}

	/**
	 * Queries the filecache for all root level folders and returns the sum of their sizes.
	 * This also includes e.g. thumbnails and avatars.
	 *
	 * @return int
	 */
	private function getUsedSpace(): int {
		$statement = null;
		try {
			$qb = $this->dbConnection->getQueryBuilder();
			if ($this->dbConnection->getDatabasePlatform() instanceof OraclePlatform) {
				// `size` is a reserved word in oracle db. need to escape it oracle-style.
				$qb->selectAlias($qb->createFunction('SUM("size")'), 'total_size');
			} else {
				$qb->selectAlias($qb->createFunction('SUM(size)'), 'total_size');
			}
			$qb->from('filecache')
				->where($qb->expr()->eq('parent', $qb->expr()->literal(-1)))
				->andWhere($qb->expr()->gt('size', $qb->expr()->literal(0)));
			$statement = $qb->execute();
			/* @phan-suppress-next-line PhanDeprecatedFunction */
			return (int)$statement->fetch()['total_size'];
		} finally {
			if ($statement) {
				/* @phan-suppress-next-line PhanDeprecatedFunction */
				$statement->closeCursor();
			}
		}
	}
}
